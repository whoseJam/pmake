#include<iostream>
#include<cstring>
#include<cstdio>
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

const int N=50005;
int a[N],n,l1[N],l2[N],r1[N],r2[N];
int st[N][20],Log2[N];

struct trie{
	int siz,ch[2];
}t[N*40];
int rt[N],tot;

void insert(int& x,int last,int v,int k){
	t[x=++tot]=t[last];t[x].siz++;
	if(k==-1)return;
	int dir=(v>>k)&1;
	insert(t[x].ch[dir],t[last].ch[dir],v,k-1);
}

int nodeSize(int xl,int xr){
	return t[xr].siz-t[xl].siz;
}

int query(int xl,int xr,int v,int k){
	if(k==-1)return 0;
	int dir=(v>>k)&1;
	if(nodeSize(t[xl].ch[dir^1],t[xr].ch[dir^1])==0)
		return query(t[xl].ch[dir],t[xr].ch[dir],v,k-1);
	return query(t[xl].ch[dir^1],t[xr].ch[dir^1],v,k-1)+(1<<k);
}

int ask(int l,int r){
	int k=Log2[r-l+1];
	return max(st[l][k],st[r-(1<<k)+1][k]);
}

// [1,x) value>v
int FindL(int x,int v){
	if(x<=1)return 0;
	int l=1,r=x-1,mid;
	while(l<=r){
		mid=(l+r)>>1;
		if(ask(mid,x-1)>v)l=mid+1;
		else r=mid-1;
	}	
	return r;
}

// (x,n] value>v
int FindR(int x,int v){
	if(x+1>n)return n+1;
	int l=x+1,r=n,mid;
	while(l<=r){
		mid=(l+r)>>1;
		if(ask(x+1,mid)>v)r=mid-1;
		else l=mid+1;
	}
	return l;
}

void Prepare(){
	for(int i=2;i<=n;i++)Log2[i]=Log2[i>>1]+1;
	for(int i=1;i<=n;i++)st[i][0]=a[i];
	for(int j=1;j<=19;j++)
		for(int i=1;i+(1<<j)-1<=n;i++){
			st[i][j]=max(st[i][j-1],st[i+(1<<j-1)][j-1]);
		}
	for(int i=1;i<=n;i++){
		l1[i]=FindL(i,a[i]);
		l2[i]=FindL(l1[i],a[i]);
		r1[i]=FindR(i,a[i]);
		r2[i]=FindR(r1[i],a[i]);
	}
}

int Solve(int l,int r,int x){
	return query(rt[l-1],rt[r],x,30);
}

int main(){
	n=read();
	for(int i=1;i<=n;i++)a[i]=read();
	Prepare();
	for(int i=1;i<=n;i++)
		insert(rt[i],rt[i-1],a[i],30);
	int ans=0;
	for(int i=1;i<=n;i++){
		if(l1[i]!=0)ans=max(ans,Solve(l2[i]+1,r1[i]-1,a[i]));
		if(r1[i]!=n+1)ans=max(ans,Solve(l1[i]+1,r2[i]-1,a[i]));
	}
	cout<<ans<<'\n';
	return 0;
}

