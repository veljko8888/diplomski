using Microsoft.EntityFrameworkCore.Migrations;
using TestCoreAPI.ApplicationConstants;

namespace TestCoreAPI.Migrations
{
    public partial class insert_lexicons : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(AppConstants.DefaultValuesDB);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("Delete from dbo.Lexicons");
        }
    }
}
