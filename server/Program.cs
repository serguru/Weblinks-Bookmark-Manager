
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using server.Data;
using server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                            ValidAudience = builder.Configuration["JwtSettings:Audience"],
                            IssuerSigningKey = new SymmetricSecurityKey(
                                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]))
                        };
                    });

            builder.Services.AddDbContextPool<Links3dbContext>(options =>
            {
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DbContext"),
                provideroptions => provideroptions.EnableRetryOnFailure()

                );
                //options.EnableSensitiveDataLogging();
                options.EnableDetailedErrors();

            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("default", policy =>
                {
                    policy.WithOrigins("http://localhost:4200", "https://links3.azurewebsites.net") // Corrected frontend URL without trailing slash
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });


            builder.Services.AddCors();

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddAutoMapper(typeof(MappingProfile));
            builder.Services.AddScoped<IPagesRepository, PagesRepository>();
            builder.Services.AddScoped<IPagesService, PagesService>();
            builder.Services.AddScoped<IAccountsRepository, AccountsRepository>();
            builder.Services.AddScoped<IAccountsService, AccountsService>();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseCors("default");


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
