
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Configuration;
using MailKit.Net.Smtp;
using MimeKit;
using server.Common;

namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);



            builder.Services.AddHttpContextAccessor();

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        var secretKey = builder.Configuration["JwtSettings:SecretKey"];
                        if (string.IsNullOrEmpty(secretKey))
                        {
                            throw new InvalidOperationException("SecretKey is not configured");
                        }

                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                            ValidAudience = builder.Configuration["JwtSettings:Audience"],
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
                        };
                    });

            builder.Services.AddDbContextPool<Links3dbContext>(options =>
            {
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DbContext"),
                provideroptions => provideroptions.EnableRetryOnFailure()

                );
                options.EnableDetailedErrors();
            });

            builder.Services.AddDbContextFactory<Links3dbContext>(options =>
            {
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DbContext"),
                    providerOptions => providerOptions.EnableRetryOnFailure()
                );
                options.EnableDetailedErrors();
            });



            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Development", policy =>
                {
                    policy
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
                options.AddPolicy("Production", policy =>
                {
                    policy
                        .WithOrigins(
                            "https://weblinks.click",
                            "https://api.weblinks.click"
                        )
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                    //  .AllowCredentials();
                });
            });

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddAutoMapper(typeof(MappingProfile));
            builder.Services.AddScoped<ILinksRepository, LinksRepository>();
            builder.Services.AddScoped<ITasksRepository, TasksRepository>();
            builder.Services.AddScoped<IColumnsRepository, ColumnsRepository>();
            builder.Services.AddScoped<IRowsRepository, RowsRepository>();
            builder.Services.AddScoped<IPagesRepository, PagesRepository>();
            builder.Services.AddScoped<IPagesService, PagesService>();
            builder.Services.AddScoped<IAccountsRepository, AccountsRepository>();
            builder.Services.AddScoped<IAccountsService, AccountsService>();
            builder.Services.AddScoped<ITokenService, TokenService>();
            builder.Services.Configure<MailKitSettings>(builder.Configuration.GetSection("MailKit"));
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddHostedService<TasksService>();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseCors("Development");
            } else
            {
                app.UseCors("Production");
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}

/*
 
 using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Define CORS policies
        builder.Services.AddCors(options =>
        {
            // Development policy - more permissive
            options.AddPolicy("Development", policy =>
            {
                policy
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .WithExposedHeaders("Content-Disposition"); // Useful for file downloads
            });

            // Production policy - more restrictive
            options.AddPolicy("Production", policy =>
            {
                policy
                    .WithOrigins(
                        "https://your-production-domain.com",
                        "https://api.your-production-domain.com"
                    )
                    .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .WithHeaders(
                        "Authorization",
                        "Content-Type",
                        "Accept",
                        "X-Requested-With"
                    )
                    .WithExposedHeaders("Content-Disposition")
                    .AllowCredentials();
            });
        });

        // Add other services
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        // Configure CORS based on environment
        if (app.Environment.IsDevelopment())
        {
            app.UseCors("Development");
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.UseCors("Production");
        }

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}
 */