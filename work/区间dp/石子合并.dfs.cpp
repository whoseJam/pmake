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
const int N=205;
int n,nn,a[N],s[N];
struct Node{
	int mx,mn;
};
Node dp[N][N];
bool vis[N][N];
Node operator +(Node a,Node b){
	return (Node){a.mx+b.mx,a.mn+b.mn};
}
Node operator +(Node a,int b){
	return (Node){a.mx+b,a.mn+b};
}
Node Merge(Node a,Node b){
	return (Node){max(a.mx,b.mx),min(a.mn,b.mn)};
}

Node Dfs(int i,int j){
	if(i==j)return (Node){0,0};
	if(vis[i][j])return dp[i][j];
	Node ans=(Node){-inf,inf};
	for(int k=i;k<j;k++){
		Node tmp=Dfs(i,k)+Dfs(k+1,j)+(s[j]-s[i-1]);
		ans=Merge(ans,tmp);
	}
	vis[i][j]=1;
	dp[i][j]=ans;
	return ans;
}

int main(){
	n=read();
	for(int i=1;i<=n;i++)a[i]=a[i+n]=read();
	
	nn=n*2;
	for(int i=1;i<=nn;i++)s[i]=s[i-1]+a[i];
	
	int ansmx=-inf,ansmn=inf;
	for(int i=1;i<=n;i++){
		ansmx=max(ansmx,Dfs(i,i+n-1).mx);
		ansmn=min(ansmn,Dfs(i,i+n-1).mn);
	}
	cout<<ansmn<<endl;
	cout<<ansmx<<endl;
	return 0;
}

