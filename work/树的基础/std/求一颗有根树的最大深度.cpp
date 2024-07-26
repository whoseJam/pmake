#include<bits/stdc++.h>
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

const int N=1005;
int n,m,depth;

struct line{
	int Nxt,to;
}l[N*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

void Dfs(int u,int f,int d){
    depth=max(depth,d);
    for(int i=h[u],v;i;i=l[i].Nxt){
        v=l[i].to;
        if(v==f)continue;
        Dfs(v,u,d+1);
    }
}

int main(){
	cin>>n>>m;
	for(int i=1,x,y;i<n;i++){
		cin>>x>>y;
		Link(x,y);
	}
	Dfs(m,0,1);
	cout<<depth;
	return 0;
}

