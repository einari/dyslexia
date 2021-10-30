var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSpaStaticFiles(_ => _.RootPath = "wwwroot");
var app = builder.Build();

app.UseDefaultFiles();
app.UseSpaStaticFiles();

app.Run();
