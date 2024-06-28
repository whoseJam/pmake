#include<iostream>
#include<cstdio>
#include<cstring>
#include<queue>
using namespace std;
int N,p,m1,f1,m2,f2,INF=0x3f3f3f3f;
int dis[2005],Inque[2005],prt[2005];

struct line
{
	int nextLine,to,flow,cost;
}l[1000005];
int cnt=1,h[2005];

void addEdge(int u,int v,int Flow,int Cost)
{
	l[++cnt].nextLine=h[u];l[cnt].to=v;l[cnt].flow=Flow;l[cnt].cost=Cost;h[u]=cnt;
	l[++cnt].nextLine=h[v];l[cnt].to=u;l[cnt].flow=0;l[cnt].cost=-Cost;h[v]=cnt;
}

int SPFA()
{
	queue<int>q;
	for(int i=1;i<=N*2+2;i++)dis[i]=INF,Inque[i]=0,prt[i]=0;
	dis[N*2+1]=0;Inque[N*2+1]=1;q.push(N*2+1);
	while(q.size())
	{
		int u=q.front();q.pop();
		Inque[u]=0;
		for(int i=h[u];i;i=l[i].nextLine)
		{
			int v=l[i].to;
			if(dis[v]>dis[u]+l[i].cost&&l[i].flow>0)
			{
				prt[v]=i;
				dis[v]=dis[u]+l[i].cost;
				if(!Inque[v])Inque[v]=1,q.push(v);
			}
		}
	}
	return dis[N*2+2]!=INF;
}

void Adjust(int &COST)
{
	int u=N*2+2,del=INF;
	while(prt[u])
	{
		del=min(l[prt[u]].flow,del);
		u=l[prt[u]^1].to;
	}
	u=N*2+2;COST+=dis[N*2+2]*del;
	while(prt[u])
	{
		l[prt[u]].flow-=del;l[prt[u]^1].flow+=del;
		u=l[prt[u]^1].to;
	}
}

int main()
{
	int R,ans=0;
	scanf("%d%d%d%d%d%d",&N,&p,&m1,&f1,&m2,&f2);
	for(int i=1;i<=N;i++)
	{
		cin>>R;
		addEdge(N*2+1,i+N,R,0);
		addEdge(i,N*2+2,R,0);
		if(i+m1<=N)addEdge(i+N,i+m1,INF,f1);
		if(i+m2<=N)addEdge(i+N,i+m2,INF,f2);
		if(i!=1)addEdge(i-1,i,INF,0);
		else addEdge(N*2+1,i,INF,p);
	}
	while(SPFA())Adjust(ans);
	printf("%d",ans);
	return 0;
}
