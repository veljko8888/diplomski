using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TestCoreAPI.Migrations
{
    public partial class assoc : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Associations",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Final = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    A1 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    A2 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    A3 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    A4 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    A = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    B1 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    B2 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    B3 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    B4 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    B = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    C1 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    C2 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    C3 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    C4 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    C = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    D1 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    D2 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    D3 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    D4 = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    D = table.Column<string>(type: "nvarchar(500)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Associations", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Associations");
        }
    }
}
