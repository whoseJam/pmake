#include<iostream>
#include<cstdio>
#include<queue>
using namespace std;

const int MAXN=10005;
int degree[MAXN],m[MAXN];
int N,M,vis,ans;

struct line{
	int nextLine,to;
}l[MAXN*2];
int h[MAXN],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;degree[v]++;
}

void Toposort(){
	queue<int>q;
	for(int i=1;i<=N;i++)
		if(degree[i]==0)q.push(i);
	while(q.size()){
		int u=q.front();q.pop();vis++;
		for(int i=h[u];i;i=l[i].nextLine){
			int v=l[i].to;
			m[v]=max(m[v],m[u]+1);
			degree[v]--;
			if(degree[v]==0)q.push(v);
		}
	}
}

int main(){
	cin>>N>>M;
	int a,b,p1,p2;
	for(int i=1;i<=N;i++)
		m[i]=100;
	for(int i=1;i<=M;i++){
		cin>>a>>b;
		Link(b,a);
	}
	Toposort();
	
	if(vis!=N){
		cout<<"Poor Xed";
		return 0;
	}
	for(int i=1;i<=N;i++)ans+=m[i];
	cout<<ans;
	return 0;
}
