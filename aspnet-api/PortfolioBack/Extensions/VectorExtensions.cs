using Pgvector;

namespace PortfolioBack.Extensions;

public static class VectorExtensions
{
  /// <summary>
  /// Converts a float array to a pgvector Vector
  /// </summary>
  /// <param name="embeddings">Float array containing the embedding values</param>
  /// <returns>Vector object for use with pgvector</returns>
  public static Vector ToVector(this float[] embeddings)
  {
    return new Vector(embeddings);
  }

  /// <summary>
  /// Converts a Vector to a float array
  /// </summary>
  /// <param name="vector">Vector object from pgvector</param>
  /// <returns>Float array representation</returns>
  public static float[] ToFloatArray(this Vector vector)
  {
    return vector.ToArray();
  }
}
