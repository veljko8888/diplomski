﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TestCoreAPI.Models;

namespace TestCoreAPI.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("TestCoreAPI.Models.Association", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("A")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("A1")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("A2")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("A3")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("A4")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("B")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("B1")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("B2")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("B3")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("B4")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("C")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("C1")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("C2")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("C3")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("C4")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("D")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("D1")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("D2")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("D3")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("D4")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("Final")
                        .HasColumnType("nvarchar(500)");

                    b.HasKey("Id");

                    b.ToTable("Associations");
                });

            modelBuilder.Entity("TestCoreAPI.Models.Connection", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(500)");

                    b.HasKey("Id");

                    b.ToTable("Connections");
                });

            modelBuilder.Entity("TestCoreAPI.Models.Lexicon", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<double>("SentimentScore")
                        .HasColumnType("float");

                    b.Property<string>("Word")
                        .HasColumnType("nvarchar(150)");

                    b.HasKey("Id");

                    b.ToTable("Lexicons");
                });

            modelBuilder.Entity("TestCoreAPI.Models.Pair", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("ConnectionId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Left")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("Right")
                        .HasColumnType("nvarchar(500)");

                    b.HasKey("Id");

                    b.HasIndex("ConnectionId");

                    b.ToTable("Pairs");
                });

            modelBuilder.Entity("TestCoreAPI.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("DatumRodjenja")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(150)");

                    b.Property<string>("Ime")
                        .HasColumnType("nvarchar(150)");

                    b.Property<string>("KorisnickoIme")
                        .HasColumnType("nvarchar(150)");

                    b.Property<bool>("NalogAktiviran")
                        .HasColumnType("bit");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(350)");

                    b.Property<string>("PasswordSalt")
                        .HasColumnType("nvarchar(350)");

                    b.Property<string>("Pol")
                        .HasColumnType("nvarchar(1)");

                    b.Property<string>("Prezime")
                        .HasColumnType("nvarchar(150)");

                    b.Property<byte[]>("ProfilnaSlika")
                        .HasColumnType("varbinary(max)");

                    b.Property<int>("TipKorisnika")
                        .HasColumnType("int");

                    b.Property<string>("Zanimanje")
                        .HasColumnType("nvarchar(150)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TestCoreAPI.Models.UserRegistrationConfirmation", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("nvarchar(150)");

                    b.Property<DateTime>("TokenExpirationTime")
                        .HasColumnType("datetime2");

                    b.HasKey("UserId");

                    b.ToTable("UserRegistrationConfirmations");
                });

            modelBuilder.Entity("TestCoreAPI.Models.Word", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Rec")
                        .HasColumnType("nvarchar(150)");

                    b.HasKey("Id");

                    b.ToTable("Words");
                });

            modelBuilder.Entity("TestCoreAPI.Models.Pair", b =>
                {
                    b.HasOne("TestCoreAPI.Models.Connection", "Connection")
                        .WithMany("Pairs")
                        .HasForeignKey("ConnectionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TestCoreAPI.Models.UserRegistrationConfirmation", b =>
                {
                    b.HasOne("TestCoreAPI.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
