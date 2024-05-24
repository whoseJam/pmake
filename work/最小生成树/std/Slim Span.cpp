#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
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

const int inf=0x3f3f3f3f;
const int M=10005;
const int N=105;
int n,m,fa[N];

struct edge{
	int a,b,value;
}e[M];

bool cmp(const edge& a,const edge& b){
	return a.value<b.value;
}

int getFa(int x){
	if(fa[x]==x)return x;
	return fa[x]=getFa(fa[x]);
}

void Merge(int x,int y){
	int fx=getFa(x),fy=getFa(y);
	fa[fx]=fy;
}

int Kruskal(int start){
	int tot=0;
	for(int i=1;i<=n;i++)fa[i]=i;
	for(int i=start;i<=m;i++){
		if(getFa(e[i].a)==getFa(e[i].b))continue;
		tot++;
		Merge(e[i].a,e[i].b);
		if(tot==n-1)return e[i].value-e[start].value;
	}
	return inf;
}

void Solve(){
	for(int i=1,a,b,v;i<=m;i++){
		e[i].a=read();
		e[i].b=read();
		e[i].value=read();
	}
	sort(e+1,e+1+m,cmp);
	int result=inf;
	for(int i=1;i<=m;i++){
		int ans=Kruskal(i);
		if(ans==inf)break;
		result=min(result,ans);
	}
	if(result==inf)cout<<"-1\n";
	else cout<<result<<'\n';
}

int main(){
	while(cin>>n>>m&&!(n==0&&m==0))Solve();
	return 0;
}

