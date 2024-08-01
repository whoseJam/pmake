#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int N=100005;
int low[N],high[N],dfn,n,m;
int val[N];

struct line{
	int Nxt,to;
}l[N*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

struct TArray{
	int c[N];
	int lowbit(int x){
		return x&(-x);
	}
	void add(int x,int d){
		for(int i=x;i<=n;i+=lowbit(i))
			c[i]+=d;
	}
	int sum(int x){
		int ans=0;
		for(int i=x;i>0;i-=lowbit(i))
			ans+=c[i];
		return ans;
	}
	int sum(int l,int r){
		return sum(r)-sum(l-1);
	}
}T;

void Dfs(int u,int f){
	low[u]=++dfn;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f){
			Dfs(v,u);
		}
	}
	high[u]=dfn;
}

int main(){
	n=read();
	for(int i=1,x,y;i<n;i++){
		x=read();y=read();
		Link(x,y);
	}
	Dfs(1,0);
	for(int i=1;i<=n;i++){
		val[i]=1;
		T.add(low[i],1);
	}
	
	m=read();char opt[3];
	for(int i=1,x;i<=m;i++){
		scanf("%s",opt);x=read();
		if(opt[0]=='Q')cout<<T.sum(low[x],high[x])<<'\n';
		else{
			int d=(val[x]==0)?1:-1;
			val[x]^=1;
			T.add(low[x],d);
		}
	}
	return 0;
}

