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

struct Item{
	int v,w;
};

vector<Item> items;

void split(int v,int w,int m){
	for(int i=0;(1<<i)<=m;i++){
		items.push_back((Item){v*(1<<i),w*(1<<i)});
		m-=(1<<i);
	}
	if(m)items.push_back((Item){v*m,w*m});
}

const int N=105;
const int W=40005;
int f[W],n,w;

int main(){
	n=read();w=read();
	for(int i=1,v,w,m;i<=n;i++){
		v=read();w=read();m=read();
		split(v,w,m);
	}
	for(int i=0;i<items.size();i++){
		int vi=items[i].v;
		int wi=items[i].w;
		for(int j=w;j>=wi;j--){
			f[j]=max(f[j],f[j-wi]+vi);
		}
	}
	cout<<f[w]<<'\n';
	return 0;
}
