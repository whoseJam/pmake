#include<iostream>
#include<cstdio>
#include<cstring>
#include<stack>
using namespace std;
int N,M,T=0,SCC=0;
int belong[200005],dfn[200005],low[200005],Instack[200005],opp[200005],mark[200005];
stack<int>s;

struct line
{
	int nextLine,to;
}l[1000005];
int cnt=0,h[200005];

void addEdge(int fa,int kid)
{
	cnt++;
	l[cnt].nextLine=h[fa];
	l[cnt].to=kid;
	h[fa]=cnt;
}

void Tarjan(int u)
{
	dfn[u]=low[u]=++T;
	s.push(u);Instack[u]=1;
	for(int i=h[u];i;i=l[i].nextLine)
	{
		int v=l[i].to;
		if(!dfn[v])
		{
			Tarjan(v);
			low[u]=min(low[u],low[v]);
		}
		else if(Instack[v])low[u]=min(low[u],dfn[v]);
	}
	if(dfn[u]==low[u])
	{
		SCC++;
		for(;;)
		{
			belong[s.top()]=SCC;
			Instack[s.top()]=0;
			if(s.top()==u){s.pop();break;}
			s.pop();
		}
	}
}

int main()
{
	scanf("%d%d",&N,&M);
	
	int num1,num2;
	char sex1[3],sex2[3];
	for(int i=1;i<=M;i++)
	{
		scanf("%d%s%d%s",&num1,&sex1,&num2,&sex2);
		if(sex1[0]=='w')num1+=N;
		if(sex2[0]=='w')num2+=N;
		addEdge(num1+2*N,num2);addEdge(num2+2*N,num1);
	}
	for(int i=1;i<N;i++)
	{
		addEdge(i,i+3*N);addEdge(i+3*N,i);
		addEdge(i+N,i+2*N);addEdge(i+2*N,i+N);
	}
	addEdge(0,2*N);addEdge(3*N,N);
	
	for(int i=0;i<=4*N-1;i++)
		if(!dfn[i])Tarjan(i);
	for(int i=0;i<=2*N-1;i++)
	{
		if(belong[i]==belong[i+2*N])
		{
			printf("bad luck\n");
			return 0;
		}
		opp[belong[i]]=belong[i+2*N];
		opp[belong[i+2*N]]=belong[i];
	}
	
	for(int i=1;i<=SCC;i++)
		if(!mark[i])mark[i]=1,mark[opp[i]]=2;
	for(int i=1;i<=N-1;i++)
	{
		if(mark[belong[i]]==1)printf("%dh ",i);
		else if(mark[belong[i+N]]==1)printf("%dw ",i);
	}
	return 0;
}
