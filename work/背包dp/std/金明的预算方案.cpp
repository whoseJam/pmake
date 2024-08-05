#include<bits/stdc++.h>
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

const int N=32005;
const int M=65;
int n,m,v[M],w[M],q[M];
vector<int> attach[M];
int dp[N];

void update(int i,int v,int w){
	if(i>=v)dp[i]=max(dp[i],dp[i-v]+w);
}

void insert(int id,int a1,int a2){
	for(int i=n;i>=0;i--){
		int tmpv1=v[id]+v[a1]+v[a2];
		int tmpw1=v[id]*w[id]+v[a1]*w[a1]+v[a2]*w[a2];
		update(i,tmpv1,tmpw1);
		
		int tmpv2=v[id]+v[a1];
		int tmpw2=v[id]*w[id]+v[a1]*w[a1];
		update(i,tmpv2,tmpw2);
		
		int tmpv3=v[id]+v[a2];
		int tmpw3=v[id]*w[id]+v[a2]*w[a2];
		update(i,tmpv3,tmpw3);
		
		int tmpv4=v[id];
		int tmpw4=v[id]*w[id];
		update(i,tmpv4,tmpw4);
	}
}

int main(){
	n=read();m=read();
	for(int i=1;i<=m;i++){
		v[i]=read();
		w[i]=read();
		q[i]=read();
		if(q[i])attach[q[i]].push_back(i);
	}
	for(int i=1;i<=m;i++){
		if(q[i])continue;
		int a1=(attach[i].size()>=1)?attach[i][0]:0;
		int a2=(attach[i].size()>=2)?attach[i][1]:0;
		insert(i,a1,a2); 
	}
	cout<<dp[n]<<'\n';
	return 0;
}

