#include<bits/stdc++.h>
using namespace std;
typedef long long ll;

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
int depth,width;

struct line{
	int Nxt,to;
}l[N];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
}

void Dfs(int u,int d){
	depth=max(depth,d);
	int siz=0;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		siz++;
		Dfs(v,d+1);
	}
	width=max(width,siz);
}

int main(){
	int n=read(),root=0;
	for(int i=1,x,y;i<=n;i++){
		x=read();y=read();
		if(y==0)root=x;
		else Link(y,x);
	}
	Dfs(root,1);
	cout<<depth<<" "<<width;
	return 0;
}