using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.SignalRHub
{
    public class BroadcastHub : Hub<IHubClient>
    {
        public async Task EnterSecond(string GameId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GameId);
            await Clients.Group(GameId).GameStarted();
        }

        public async Task EnterFirst(string GameId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GameId);
        }
    }
}
