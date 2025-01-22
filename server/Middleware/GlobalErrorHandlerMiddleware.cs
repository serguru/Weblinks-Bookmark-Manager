using Newtonsoft.Json;
using server.Services;

namespace server.Middleware;

public class GlobalErrorHandlerMiddleware(RequestDelegate next, IServiceProvider serviceProvider)
{
    private readonly RequestDelegate _next = next;
    private readonly IServiceProvider _serviceProvider = serviceProvider;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var emailService = scope.ServiceProvider.GetService<IEmailService>();
                await HandleExceptionAsync(context, ex, emailService);
            }
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception, IEmailService emailService)
    {
        var statusCode = StatusCodes.Status500InternalServerError;
        var errorMessage = exception.Message;

        if (errorMessage != null) 
        {
            await emailService.SendEmailToAdminAsync("An exception occurred on the server",
                JsonConvert.SerializeObject(exception));
        }

        var response = context.Response;
        response.ContentType = "application/json";
        response.StatusCode = statusCode;

        await response.WriteAsync(JsonConvert.SerializeObject(new { message = errorMessage }));
    }
}
