using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class BestUserDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string UserName2 { get; set; }
        public int TotalPoints { get; set; }
        public int TotalPoints2 { get; set; }
        public int PlayedGames { get; set; }
        public double AveragePointsPerGame { get; set; }
        public int Ranking { get; set; }
    }
}
