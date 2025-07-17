#include<iostream>
#include<cstdio>
#include<cstring>
#include<stack>
using namespace std;

const int N=10005;
const int M=50005;
int dfn[N],low[N],ins[N],bel[N],siz[N],SCC,tot;
int n,m,Out[N],ans;
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
		SCC++;
		while(true){
			int t=s.top();s.pop();
			siz[SCC]++;
			bel[t]=SCC;
			ins[t]=0;
			if(t==u)break;
		}
	}
}

void Find(){
	for(int u=1;u<=n;u++)
		for(int i=h[u];i;i=l[i].Nxt){
			int v=l[i].to;
			if(bel[u]!=bel[v])Out[bel[u]]++;
		}
}

int main(){
	cin>>n>>m;
	for(int i=1,a,b;i<=m;i++){
		cin>>a>>b;
		Link(a,b);
	}
	for(int i=1;i<=n;i++)
		if(!dfn[i])Tarjan(i);
	Find();
	
	int pos,count=0;
	for(int i=1;i<=SCC;i++)
		if(!Out[i]){
			pos=i;
			count++;
		}
	if(count==1)cout<<siz[pos]<<'\n';
	else cout<<0<<'\n';
	return 0;
}

