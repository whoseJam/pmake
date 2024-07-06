#include<iostream>
#include<cstdio>
#include<cstring>
#include<stack>
using namespace std;

namespace FastIO{
	const int L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int N=1005;
const int M=200005;
int dfn[N],low[N],ins[N],bel[N],SCC,tot;
int n,Ind[N],Out[N];
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
	for(int u=1;u<=n;u++)
		for(int i=h[u];i;i=l[i].Nxt){
			int v=l[i].to;
			if(bel[u]!=bel[v]){
				Out[bel[u]]++;
				Ind[bel[v]]++;
			}
		}
}

int main(){
	cin>>n;
	for(int i=1;i<=n;i++){
		int to=read();
		while(to!=0){
			Link(i,to);
			to=read();
		}
	} 
	for(int i=1;i<=n;i++)
		if(!dfn[i])Tarjan(i);
	if(SCC==1){
		cout<<1<<'\n';
		cout<<0<<'\n';
		return 0;
	}
	Find();
	int i0=0,o0=0;
	for(int i=1;i<=SCC;i++){
		if(!Ind[i])i0++;
		if(!Out[i])o0++;
	}
	cout<<i0<<'\n';
	cout<<max(i0,o0)<<'\n';
	return 0;
}
