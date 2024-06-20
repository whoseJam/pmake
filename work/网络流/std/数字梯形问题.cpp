#include<iostream>
#include<cstring>
#include<cstdio>
#include<queue>
using namespace std;
int map[50][50],num[50][50],tot,N,M,INF=0x3f3f3f3f;
int dis[2005],Inque[2005],prt[2005];

struct line
{
	int nextLine,to,flow,cost;
}l[4][200005];
int cnt[4]={0,1,1,1},h[4][2005];

void addEdge(int C,int u,int v,int flow,int cost)
{
	l[C][++cnt[C]].nextLine=h[C][u];l[C][cnt[C]].to=v;l[C][cnt[C]].flow=flow;l[C][cnt[C]].cost=cost;h[C][u]=cnt[C];
	l[C][++cnt[C]].nextLine=h[C][v];l[C][cnt[C]].to=u;l[C][cnt[C]].flow=0;l[C][cnt[C]].cost=-cost;h[C][v]=cnt[C];
}

int SPFA(int C,int Start,int End,int Num)
{
	queue<int>q;
	for(int i=1;i<=Num;i++)dis[i]=-INF,Inque[i]=0,prt[i]=0;
	dis[Start]=0;Inque[Start]=1;q.push(Start);
	while(q.size())
	{
		int u=q.front();q.pop();Inque[u]=0;
		for(int i=h[C][u];i;i=l[C][i].nextLine)
		{
			int v=l[C][i].to;
			if(dis[v]<dis[u]+l[C][i].cost&&l[C][i].flow>0)
			{
				prt[v]=i;
				dis[v]=dis[u]+l[C][i].cost;
				if(!Inque[v])Inque[v]=1,q.push(v);
			}
		}
	}
	return dis[End]!=-INF;
}

void Adjust(int C,int &COST,int End)
{
	int del=INF,u=End;
	while(prt[u])
	{
		del=min(del,l[C][prt[u]].flow);
		u=l[C][prt[u]^1].to;
	}
	COST+=del*dis[End];u=End;
	while(prt[u])
	{
		l[C][prt[u]].flow-=del;l[C][prt[u]^1].flow+=del;
		u=l[C][prt[u]^1].to;
	}
}

int main()
{
	scanf("%d%d",&M,&N);
	for(int i=1;i<=N;i++)
		for(int j=1;j<=i+M-1;j++)
			scanf("%d",&map[i][j]),num[i][j]=++tot;
	for(int i=1;i<=N;i++)
	{
		for(int j=1;j<=i+M-1;j++)
		{
			addEdge(1,num[i][j],num[i][j]+tot,1,map[i][j]);		//1:S=tot*2+1,T=tot*2+2
			if(i==1)
			{
				addEdge(1,tot*2+1,num[i][j],1,0);
				addEdge(2,tot+1,num[i][j],1,0);
				addEdge(3,tot+1,num[i][j],1,0);
			}
			
			if(i!=N)
			{
				addEdge(1,num[i][j]+tot,num[i+1][j],1,0);
				addEdge(1,num[i][j]+tot,num[i+1][j+1],1,0);
				addEdge(2,num[i][j],num[i+1][j],1,map[i][j]);
				addEdge(2,num[i][j],num[i+1][j+1],1,map[i][j]);
				addEdge(3,num[i][j],num[i+1][j],INF,map[i][j]);
				addEdge(3,num[i][j],num[i+1][j+1],INF,map[i][j]);
			}
			else
			{
				addEdge(1,num[i][j]+tot,tot*2+2,1,0);
				addEdge(2,num[i][j],tot+2,INF,map[i][j]);
				addEdge(3,num[i][j],tot+2,INF,map[i][j]);
			}
		}
	}
	int ans1=0,ans2=0,ans3=0;
	while(SPFA(1,tot*2+1,tot*2+2,tot*2+2))Adjust(1,ans1,tot*2+2);
	while(SPFA(2,tot+1,tot+2,tot+2))Adjust(2,ans2,tot+2);
	while(SPFA(3,tot+1,tot+2,tot+2))Adjust(3,ans3,tot+2);
	printf("%d\n%d\n%d",ans1,ans2,ans3);
	return 0;
}
