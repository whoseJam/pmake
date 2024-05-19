#include<iostream>
#include<cstdio>
#include<cstring>
#include<stack>
using namespace std;

const int N=1005;
const int M=1000005;
int dfn[N],low[N],ins[N],bel[N],SCC,tot;
int n,Ind[N],ans;
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
			bel[t]=SCC;
			ins[t]=0;
			if(t==u)break;
		}
	}
}

void Find(){
	for(int i=1;i<=n;i++)
		for(int j=h[i];j;j=l[j].Nxt){
			int v=l[j].to;
			if(bel[i]!=bel[v])Ind[bel[v]]++;
		}
}

int main(){
	cin>>n;
	for(int i=1;i<=n;i++)
		for(int j=1;j<=n;j++){
			int flg;
			cin>>flg;
			if(flg)Link(i,j);
		}
	for(int i=1;i<=n;i++)
		if(!dfn[i])Tarjan(i);
	Find();
	for(int i=1;i<=SCC;i++)
		if(!Ind[i])ans++;
	cout<<ans;
	return 0;
}
