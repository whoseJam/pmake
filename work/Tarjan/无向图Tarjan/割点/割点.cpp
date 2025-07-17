#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
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

const int N=20005;
const int M=100005;
int n,m,rt,dfn[N],low[N],tot,prt[N],mark[N];
int sonCount;

struct line{
	int Nxt,to;
}l[M*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

void Tarjan(int u){
	dfn[u]=low[u]=++tot;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(prt[u]==v)continue;
		if(dfn[v]==0){
			prt[v]=u;
			Tarjan(v);
			low[u]=min(low[u],low[v]);
			if(low[v]>=dfn[u]){
				mark[u]=1;
				if(u==rt)sonCount++;
			}
		}else low[u]=min(low[u],dfn[v]);
	}
}

int main(){
	n=read();m=read();
	for(int i=1,x,y;i<=m;i++){
		x=read();y=read();
		Link(x,y);
	}
	for(int i=1;i<=n;i++){
		if(!dfn[i]){
			sonCount=0;rt=i;
			Tarjan(i);
			if(sonCount==1)mark[i]=0;
		}
	}
	
	vector<int>ans;
	for(int i=1;i<=n;i++)
		if(mark[i]==1)ans.push_back(i);
	cout<<ans.size()<<"\n";
	for(auto u:ans)cout<<u<<" ";
	return 0;
}
