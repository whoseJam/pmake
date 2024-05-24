#include <bits/stdc++.h>
using namespace std;
const int N=2005;
const int M=200005;
struct line{
	int nxt,to;
	double dis;
}l[M];
int h[N],vis[N];
double dis[N];
int n,m,cnt;
void link(int u,int v,int d){
	l[++cnt]=(line){h[u],v,1.0-d/100.0};h[u]=cnt;
}
typedef pair<double,int> pa;
priority_queue<pa,vector<pa>,less<pa>>q;
void Dijkstra(int S){
	dis[S]=1.0;
	q.push(make_pair(1.0,S));
	while(!q.empty()){
		int u=q.top().second;q.pop();
		if(vis[u])continue;
		vis[u]=1;
		for(int i=h[u],v;i;i=l[i].nxt){
			v=l[i].to;
			if(dis[v]<dis[u]*l[i].dis){
				dis[v]=dis[u]*l[i].dis;
				if(!vis[v])q.push(make_pair(dis[v],v));
			}
		}
	}
}
int main() {
	cin>>n>>m;
	for(int i=0;i<m;i++){
		int u,v,d;
		scanf("%d%d%d",&u,&v,&d);
		link(u,v,d);
		link(v,u,d);
	}
	int a,b;
	cin>>a>>b;
	Dijkstra(a);
	printf("%.8lf",100/dis[b]);
	return 0;
}

