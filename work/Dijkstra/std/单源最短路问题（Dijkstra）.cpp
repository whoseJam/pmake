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

const int inf=0x3f3f3f3f;
const int N=1005;
const int M=1005;
int dis[N],vis[N],n,m;

struct line{
	int Nxt,to,val;
}l[M*2];
int h[N],cnt;

typedef pair<int,int> pa;

void Link(int u,int v,int w){
	l[++cnt]=(line){h[u],v,w};h[u]=cnt;
}

void Dijkstra(int S){
	for(int i=1;i<=n;i++)
		dis[i]=inf;
	dis[S]=0;
	priority_queue<pa,vector<pa>,greater<pa>>q;
	q.push(make_pair(0,S));
	while(q.size()){
		int u=q.top().second;q.pop();
		if(vis[u])continue;vis[u]=1;
		for(int i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			if(dis[v]>dis[u]+l[i].val){
				dis[v]=dis[u]+l[i].val;
				q.push(make_pair(dis[v],v));
			}
		}
	}
}

int main(){
	n=read();m=read();
	for(int i=1,x,y,w;i<=m;i++){
		x=read();y=read();w=read();
		Link(x,y,w);
		Link(y,x,w);
	}
	int S=read(),T=read();
	Dijkstra(S);
	cout<<dis[T]<<'\n';
	return 0;
}

