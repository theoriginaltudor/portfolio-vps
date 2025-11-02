using System;
using Microsoft.AspNetCore.HttpOverrides;

namespace PortfolioBack.Extensions;

public static class ForwardedMiddleware
{
    public static IApplicationBuilder UseForwarded(this IApplicationBuilder applicationBuilder)
    {
        // Respect X-Forwarded-* headers from Nginx so scheme/remote IP/host are correct behind the proxy
        var fwd = new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost,
            ForwardLimit = null,
            RequireHeaderSymmetry = false
        };
        // Trust all proxies/networks inside the Docker network
        fwd.KnownNetworks.Clear();
        fwd.KnownProxies.Clear();
        applicationBuilder.UseForwardedHeaders(fwd);
        return applicationBuilder;
    }
}
