using System.Reflection;

namespace PortfolioBack.Extensions;

public static class DataShapingExtensions
{
  private static readonly Dictionary<Type, Dictionary<string, PropertyInfo>> _propsCache = new();

  private static Dictionary<string, PropertyInfo> GetPropsMap<T>()
  {
    var type = typeof(T);
    if (_propsCache.TryGetValue(type, out var cached)) return cached;

    var map = type
      .GetProperties(BindingFlags.Public | BindingFlags.Instance)
      .Where(p => p.CanRead)
      .ToDictionary(p => p.Name.ToLowerInvariant(), p => p);

    _propsCache[type] = map;
    return map;
  }

  private static IReadOnlyList<PropertyInfo> ResolveSelectedProps<T>(IEnumerable<string> fields)
  {
    var propsMap = GetPropsMap<T>();

    // Normalize and filter field names to valid properties
    var selected = new List<PropertyInfo>();
    foreach (var field in fields)
    {
      if (string.IsNullOrWhiteSpace(field)) continue;
      var key = field.Trim().ToLowerInvariant();
      if (propsMap.TryGetValue(key, out var pi))
      {
        selected.Add(pi);
      }
    }
    return selected;
  }

  /// <summary>
  /// Returns the subset of field names that match public readable properties of T (case-insensitive)
  /// </summary>
  public static IReadOnlyList<string> ValidFieldsFor<T>(IEnumerable<string> fields)
  {
    var propsMap = GetPropsMap<T>();
    var list = new List<string>();
    foreach (var field in fields)
    {
      if (string.IsNullOrWhiteSpace(field)) continue;
      var key = field.Trim().ToLowerInvariant();
      if (propsMap.ContainsKey(key))
      {
        // Return the original property name casing
        list.Add(propsMap[key].Name);
      }
    }
    return list;
  }

  public static IDictionary<string, object?> ShapeData<T>(this T source, IEnumerable<string> fields)
  {
    if (source == null) return new Dictionary<string, object?>();

    var selectedProps = ResolveSelectedProps<T>(fields);
    // If no valid fields were selected, return empty dict to let controller decide to return full object when no query params are given
    if (selectedProps.Count == 0)
    {
      // return all properties if an explicit wildcard "*" was provided
      if (fields.Any(f => f.Trim() == "*"))
      {
        selectedProps = GetPropsMap<T>().Values.ToList();
      }
      else
      {
        return new Dictionary<string, object?>();
      }
    }

    var shaped = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
    foreach (var pi in selectedProps)
    {
      shaped[pi.Name] = pi.GetValue(source);
    }
    return shaped;
  }

  public static IEnumerable<IDictionary<string, object?>> ShapeData<T>(this IEnumerable<T> source, IEnumerable<string> fields)
  {
    if (source == null) yield break;
    var selectedProps = ResolveSelectedProps<T>(fields);
    if (selectedProps.Count == 0)
    {
      if (fields.Any(f => f.Trim() == "*"))
      {
        selectedProps = GetPropsMap<T>().Values.ToList();
      }
      else
      {
        foreach (var _ in source)
        {
          // Yield empty dicts; controller will detect no query fields and return full objects instead.
          yield return new Dictionary<string, object?>();
        }
        yield break;
      }
    }

    foreach (var item in source)
    {
      if (item == null)
      {
        yield return new Dictionary<string, object?>();
        continue;
      }
      var shaped = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
      foreach (var pi in selectedProps)
      {
        shaped[pi.Name] = pi.GetValue(item);
      }
      yield return shaped;
    }
  }
}
