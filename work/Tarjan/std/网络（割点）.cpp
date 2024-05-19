#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

const int N=1005;
const int M=100005;
int n,dfn[N],low[N],tot,prt[N],mark[N];
int sonCount;

struct line{
	int Nxt,to;
}l[M];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

void Tarjan(int u){
	dfn[u]=low[u]=++tot;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(prt[u]!=v){
			if(dfn[v]==0){
				prt[v]=u;
				Tarjan(v);
				low[u]=min(low[u],low[v]);
				if(low[v]>=dfn[u]){
					if(mark[u]==0)mark[u]=1;
					if(u==1)sonCount++;
				}
			}else low[u]=min(low[u],dfn[v]);
		}
	}
}

void Clear(){
	memset(h,0,sizeof(h));
	memset(low,0,sizeof(low));
	memset(mark,0,sizeof(mark));
	memset(dfn,0,sizeof(dfn));
	memset(prt,0,sizeof(prt));
	cnt=0;tot=0;sonCount=0;
}

void Solve(){
	Clear();
	while(true){
		int u,v;
		char tmp;
		cin>>u;
		tmp=getchar();
		if(u==0)break;
		while(true){
			cin>>v;
			tmp=getchar();
			Link(u,v);
			if(tmp=='\n')break;
		}
	}
	Tarjan(1);
	if(sonCount==1)mark[1]=0;
	
	int ans=0;
	for(int i=1;i<=n;i++)
		if(mark[i])ans++;
	cout<<ans<<"\n";
}

int main(){
	while(true){
		cin>>n;
		if(n==0)break;
		Solve();
	}
	return 0;
}
