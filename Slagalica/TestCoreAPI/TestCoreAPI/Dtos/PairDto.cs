using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class PairDto
    {
        public Guid Id { get; set; }
        public string Left { get; set; }
        public string Right { get; set; }
        public Guid ConnectionId { get; set; }
        public virtual ConnectionDto Connection { get; set; }
    }
}
