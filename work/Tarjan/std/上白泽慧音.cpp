#include<iostream>
#include<cstdio>
#include<cstring>
#include<stack>
#include<vector>
using namespace std;

const int inf=0x3f3f3f3f;
const int N=5005;
const int M=100005;
int dfn[N],low[N],ins[N],bel[N],mn[N],siz[N],SCC,tot;
int n,m,Ind[N],Ans;
stack<int>s;

struct line{
	int Nxt,to;
}l[M];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
}

void Tarjan(int u){
	dfn[u]=low[u]=++tot;
	s.push(u);ins[u]=1;
	for(int i=h[u];i;i=l[i].Nxt){
		int v=l[i].to;
		if(dfn[v]==0){
			Tarjan(v);
			low[u]=min(low[u],low[v]);
		}else if(ins[v])low[u]=min(low[u],dfn[v]);
	}
	if(dfn[u]==low[u]){
		SCC++;mn[SCC]=inf;
		while(true){
			int t=s.top();s.pop();
			mn[SCC]=min(mn[SCC],t);
			siz[SCC]++;
			bel[t]=SCC;
			ins[t]=0;
			if(t==u)break;
		}
		Ans=max(Ans,siz[SCC]);
	}
}


int main(){
	cin>>n>>m;
	for(int i=1,a,b,t;i<=m;i++){
		cin>>a>>b>>t;
		if(t==1)Link(a,b);
		if(t==2)Link(a,b),Link(b,a);
	}
	for(int i=1;i<=n;i++)
		if(!dfn[i])Tarjan(i);
	
	cout<<Ans<<endl;
	int Min=inf;
	for(int i=1;i<=SCC;i++)
		if(Ans==siz[i])Min=min(Min,mn[i]);
	for(int i=1;i<=SCC;i++)
		if(Min==mn[i]){
			for(int u=1;u<=n;u++)
				if(bel[u]==i)cout<<u<<" ";
			break;
		}
	return 0;
}
