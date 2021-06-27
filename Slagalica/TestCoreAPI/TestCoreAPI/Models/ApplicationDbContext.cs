using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options):base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserRegistrationConfirmation> UserRegistrationConfirmations { get; set; }
        public DbSet<Lexicon> Lexicons { get; set; }
        public DbSet<Word> Words { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<Pair> Pairs { get; set; }
        public DbSet<Association> Associations { get; set; }
        public DbSet<DailyGame> DailyGames { get; set; }
        public DbSet<DailyGamePlay> DailyGamePlays { get; set; }
        public DbSet<MultiplayerGame> MultiplayerGames { get; set; }
    }
}
