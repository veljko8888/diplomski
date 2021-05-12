using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TestCoreAPI.Migrations
{
    public partial class initialmigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Lexicons",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Word = table.Column<string>(type: "nvarchar(150)", nullable: true),
                    SentimentScore = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lexicons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(150)", nullable: true),
                    Prezime = table.Column<string>(type: "nvarchar(150)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(150)", nullable: true),
                    Zanimanje = table.Column<string>(type: "nvarchar(150)", nullable: true),
                    KorisnickoIme = table.Column<string>(type: "nvarchar(150)", nullable: true),
                    Pol = table.Column<string>(type: "nvarchar(1)", nullable: true),
                    DatumRodjenja = table.Column<DateTime>(nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(350)", nullable: true),
                    PasswordSalt = table.Column<string>(type: "nvarchar(350)", nullable: true),
                    ProfilnaSlika = table.Column<byte[]>(nullable: true),
                    NalogAktiviran = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserRegistrationConfirmations",
                columns: table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    Token = table.Column<string>(type: "nvarchar(150)", nullable: false),
                    TokenExpirationTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRegistrationConfirmations", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_UserRegistrationConfirmations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Lexicons");

            migrationBuilder.DropTable(
                name: "UserRegistrationConfirmations");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
