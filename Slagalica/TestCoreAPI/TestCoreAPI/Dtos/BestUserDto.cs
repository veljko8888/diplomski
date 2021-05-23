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
        public int TotalPoints { get; set; }
        public int PlayedGames { get; set; }
        public double AveragePointsPerGame { get; set; }
    }
}
