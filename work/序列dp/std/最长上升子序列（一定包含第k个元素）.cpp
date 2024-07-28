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

const int N=200005;
int Ls[N],Lsn,a[N],n,k;
int F[N],G[N];

struct BIT{
	int c[N];
	int lowbit(int x){
		return x&(-x);
	}
	void add(int x,int d){
		for(int i=x;i<=Lsn;i+=lowbit(i))
			c[i]=max(c[i],d);
	}
	int query(int x){
		int ans=0;
		for(int i=x;i>0;i-=lowbit(i))
			ans=max(ans,c[i]);
		return ans;
	}
}Tf,Tg;

void Solve(){
	for(int i=1;i<=n;i++){
		F[i]=Tf.query(a[i]-1)+1;
		Tf.add(a[i],F[i]);
	}
	for(int i=n;i>=1;i--){
		int id=Lsn-a[i]+1;
		G[i]=Tg.query(id-1)+1;
		Tg.add(id,G[i]);
	}
}

int main(){
	n=read();k=read();
	for(int i=1;i<=n;i++)Ls[i]=a[i]=read();
	sort(Ls+1,Ls+1+n);
	Lsn=unique(Ls+1,Ls+1+n)-Ls-1;
	for(int i=1;i<=n;i++)a[i]=lower_bound(Ls+1,Ls+1+Lsn,a[i])-Ls;
	Solve();
	cout<<F[k]+G[k]-1<<'\n';
	return 0;
}
