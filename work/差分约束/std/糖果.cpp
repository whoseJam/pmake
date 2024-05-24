#include<iostream>
#include<cstring>
#include<cstdio>
#include<queue>
using namespace std;

const int N=100005;
const int M=1000005;
const int inf=0x3f3f3f3f;
typedef long long ll;
int n,k,dis[N],inq[N],tim[N];;

struct line{
	int Nxt,to,val;
}l[M];
int cnt,h[N];

void Link(int u,int v,int w){
	l[++cnt]=(line){h[u],v,w};h[u]=cnt;
}

int Spfa(){
	queue<int>q;
	for(int i=0;i<=n;i++){
		dis[i]=0;
		q.push(i);
		inq[i]=1;
	}
	while(q.size()){
		int u=q.front();q.pop();
		inq[u]=0;
		for(int i=h[u];i;i=l[i].Nxt){
			int v=l[i].to;
			if(dis[v]<dis[u]+l[i].val){
				dis[v]=dis[u]+l[i].val;
				if(!inq[v]){
					inq[v]=1;q.push(v);
					tim[v]++;
					if(tim[v]>=100)return true; // Magic Number For This Problem
				}
			}
		}
	}
	return false;
}

int main(){
	int order,x,y,flag=0;
	scanf("%d%d",&n,&k);
	for(int i=1;i<=k;i++){
		scanf("%d%d%d",&order,&x,&y);
		if(order==1){ // s[x]==s[y]
			Link(x,y,0); // s[x]+0<=s[y]
			Link(y,x,0); // s[y]+0<=s[x]
		}
		if(order==2){ // s[x]<s[y]
			if(x==y)flag=1;
			Link(x,y,1); // s[x]+1<=s[y]
		}
		if(order==3){ // s[x]>=s[y]
			Link(y,x,0); // s[y]+0<=s[x]
		}
		if(order==4){ // s[x]>s[y]
			if(x==y)flag=1;
			Link(y,x,1); // s[y]+1<=s[x]
		}
		if(order==5){ // s[y]>=s[x]
			Link(x,y,0); // s[x]+0<=s[y]
		}
	}
	if(flag){printf("-1");return 0;}
	if(!Spfa()){
		int offset=0;
		for(int i=1;i<=n;i++)
			offset=min(offset,dis[i]);
		for(int i=1;i<=n;i++)
			dis[i]=(dis[i]-offset)+1;
		ll ans=0;
		for(int i=1;i<=n;i++)
			ans+=dis[i];
		printf("%lld",ans);
	}else printf("-1");
	return 0;
}

