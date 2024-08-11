#include<iostream>
#include<cstring>
#include<cstdio>
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

const int N=200005;
const int M=1000005;
int n,m,vis[N];

struct edge{
	int x,y,c;
}e[M];

struct line{
	int Nxt,to;
}l[M*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

bool flag;
void Dfs(int u,int col){
	vis[u]=col;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(!vis[v])Dfs(v,3-col);
		else if(vis[v]==col)flag=false;
	}
}

bool Check(int k){
	cnt=0;
	memset(h,0,sizeof(h));
	memset(vis,0,sizeof(vis));
	for(int i=1;i<=m;i++){
		if(e[i].c>k){
			Link(e[i].x,e[i].y);
		}
	}
	flag=true;
	for(int i=1;i<=n;i++){
		if(!vis[i])Dfs(i,1);
	} 
	return flag;
}

int main(){
	n=read();m=read();
	
	int mxc=0;
	for(int i=1;i<=m;i++){
		e[i].x=read();
		e[i].y=read();
		e[i].c=read();
		mxc=max(mxc,e[i].c);
	}
	int l=0,r=mxc;
	while(l<=r){
		int mid=(l+r)>>1;
		if(Check(mid))r=mid-1;
		else l=mid+1; 
	}
	cout<<l<<'\n';
	return 0;
}
