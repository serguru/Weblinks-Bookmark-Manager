
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using server.Data;

namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContextPool<Links3dbContext>(options =>
            {
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DbContext"),
                provideroptions => provideroptions.EnableRetryOnFailure()

                );
                //options.EnableSensitiveDataLogging();
                options.EnableDetailedErrors();

            });



            // Add services to the container.

            builder.Services.AddControllers();


            builder.Services.AddScoped<IPagesRepository, PagesRepository>();


            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

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
