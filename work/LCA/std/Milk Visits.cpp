#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
using namespace std;

namespace FastIO{
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int N=500005;
int fa[N][20],dep[N],H[N],G[N],n,m,S;
char str[10],type[N];

struct line{
	int Nxt,to;
}l[N*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

void Dfs(int u,int f,int d){
	fa[u][0]=f;dep[u]=d;
	H[u]=H[f]+(type[u]=='H');
	G[u]=G[f]+(type[u]=='G');
	for(int i=1;i<=19;i++)
		fa[u][i]=fa[fa[u][i-1]][i-1];
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f)Dfs(v,u,d+1);
	}
}

int LCA(int x,int y){
	if(dep[x]<dep[y])swap(x,y);
	for(int i=19;i>=0;i--)
		if(dep[fa[x][i]]>=dep[y])
			x=fa[x][i];
	if(x==y)return x;
	for(int i=19;i>=0;i--)
		if(fa[x][i]!=fa[y][i]){
			x=fa[x][i];
			y=fa[y][i];
		}
	return fa[x][0];
}

int main(){
	n=read();m=read();
	scanf("%s",type+1);
	for(int i=1,x,y;i<n;i++){
		x=read();y=read();
		Link(x,y);
	}
	Dfs(1,0,1);

	vector<int>ans;
	for(int i=1;i<=m;i++){
		int x=read();
		int y=read();
		int g=LCA(x,y);
		char like;
		cin>>like;
		if(like=='H'){
			int hasH=H[x]+H[y]-2*H[g]+(type[g]=='H');
			ans.push_back(hasH>0);
		}else{
			int hasG=G[x]+G[y]-2*G[g]+(type[g]=='G');
			ans.push_back(hasG>0);
		}
	}
	for(auto v:ans)cout<<v;
	return 0;
}


