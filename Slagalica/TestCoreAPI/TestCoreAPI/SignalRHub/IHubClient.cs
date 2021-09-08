using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.SignalRHub
{
    public interface IHubClient
    {
        Task BroadcastMessage();
        Task GameStarted();
        Task CountdownTimer();
        Task CountdownTimerNums();
        Task CountdownTimerSkocko();
        Task CountdownTimerSkockoPlayer2();
        Task WordsFinished();
        Task NumsFinished();
        Task NextPlayerSkocko();
        Task NextPlayerSkockoPlayer2();
        Task TryNextPlayerSkockoPlayer2();
        Task TryNextPlayerSkocko();
        Task NextGame();
        Task NextGamePlayer2();
    }
}
