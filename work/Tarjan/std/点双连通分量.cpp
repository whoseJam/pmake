#include<bits/stdc++.h>
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

const int N=500005;
const int M=2000005;
int low[N],dfn[N],prt[N],tot,BCC;
int n,m;
stack<int>stk;
vector<int>blk[N];

struct line{
	int Nxt,to;
}l[M*2];
int h[N],cnt=1;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

void Tarjan(int u){
	int count=0;
	dfn[u]=low[u]=++tot;
	stk.push(u);
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if((prt[u]^1)!=i){
			if(!dfn[v]){
				count++;
				prt[v]=i;
				Tarjan(v);
				low[u]=min(low[u],low[v]);
				if(low[v]>=dfn[u]){
					BCC++;
					while(true){
						int t=stk.top();
						blk[BCC].push_back(t);
						stk.pop();
						if(t==v)break;
					}
					blk[BCC].push_back(u);
				}
			}else low[u]=min(low[u],dfn[v]);
		}
	}
	if(!prt[u]&&!count)blk[++BCC].push_back(u);
}

int main(){
	n=read();m=read();
	for(int i=1,x,y;i<=m;i++){
		x=read();y=read();
		if(x!=y)Link(x,y);
	}
	for(int i=1;i<=n;i++)
		if(!dfn[i]){
			Tarjan(i);
			while(stk.size())stk.pop();
		}
	cout<<BCC<<'\n';
	for(int i=1;i<=BCC;i++){
		cout<<blk[i].size()<<' ';
		for(auto it:blk[i]){
			cout<<it<<' ';
		}cout<<'\n';
	}
	return 0;
}

