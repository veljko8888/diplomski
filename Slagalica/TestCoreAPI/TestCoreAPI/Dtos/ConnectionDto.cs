using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class ConnectionDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public virtual ICollection<PairDto> Pairs { get; set; }
    }
}
