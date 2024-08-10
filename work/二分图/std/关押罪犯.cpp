#include<iostream>
#include<cstdio>
#include<cstring>
#include<queue>
using namespace std;
int N,M,color[60005],Max;
int vis[60005],ans;

struct line
{
	int nextLine,to,val;
}l[200005];
int cnt=0,h[60005];

void addEdge(int fa,int kid,int v)
{
	cnt++;
	l[cnt].nextLine=h[fa];
	l[cnt].to=kid;
	l[cnt].val=v;
	h[fa]=cnt;
}

int flag;	//ÊÇ·ñ´æÔÚ³åÍ» 
void DFS(int C,int u,int maxC)
{
	color[u]=C;
	for(int i=h[u];i;i=l[i].nextLine)
	{
		int v=l[i].to;
		if(!vis[v]&&l[i].val>maxC)
		{
			vis[v]=1;
			DFS(3-C,v,maxC);
		}
		if(color[v]!=3-color[u]&&vis[v]==1&&l[i].val>maxC)
		{
			flag=1;
		}
	}
}

bool Check(int maxC)
{
	flag=0;
	memset(vis,0,sizeof(vis));
	memset(color,0,sizeof(color));
	for(int i=1;i<=N;i++)
	{
		if(!vis[i])
		{
			vis[i]=1;
			DFS(1,i,maxC);
		}
	}
	if(flag)return false;
	return true;
}

int main()
{
	scanf("%d%d",&N,&M);
	int x,y,z;
	for(int i=1;i<=M;i++)
	{
		scanf("%d%d%d",&x,&y,&z);
		addEdge(x,y,z);
		addEdge(y,x,z);
		Max=max(Max,z);
	}
	int l=0,r=Max,mid;
	ans=Max;
	while(l<=r)
	{
		mid=(l+r)/2;
		if(Check(mid)){ans=mid;r=mid-1;}
		else l=mid+1;
	}
	
	printf("%d",ans);
	return 0;
}
