using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class WordDto
    {
        public Guid? Id { get; set; }

        public string? Rec { get; set; }
        public Guid? UserId { get; set; }
        public Guid? GameId { get; set; }
    }
}
