#include<iostream>
#include<cstdio>
#include<cstring>
using namespace std;

const int N=200005;
const int M=500005;
const int inf=0x3f3f3f3f;
int n,tot,s,t;
int prt[N],low[N],dfn[N],ans=inf;

struct line{
	int Nxt,to;
}l[M*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

void Tarjan(int u){
	low[u]=dfn[u]=++tot;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(prt[u]!=v){
			if(dfn[v]==0){
				prt[v]=u;
				Tarjan(v);
				low[u]=min(low[u],low[v]);
			}else low[u]=min(low[u],dfn[v]);
		}
	}
}

void getAns(int u){
	if(prt[u]==s)return;
	if(low[u]>=dfn[prt[u]])ans=min(ans,prt[u]);
	getAns(prt[u]);
}

int main(){
	cin>>n;
	int x,y;
	while(true){
		cin>>x>>y;
		if(x==0&&y==0)break;
		Link(x,y);
	}
	cin>>t>>s;
	Tarjan(s);
	getAns(t);
	if(ans==inf)cout<<"No solution";
	else cout<<ans;
	return 0;
}