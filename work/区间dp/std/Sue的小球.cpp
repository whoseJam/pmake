#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
#include<cmath>
#define GET getchar()
using namespace std;

inline int read(){
	int s=0,f=1;char t=GET;
	while('0'>t||t>'9'){if(t=='-')f=-1;t=GET;}
	while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=GET;}
	return s*f;
}

const double inf=1e16;

struct Ball{
	double x,y,z;
}b[1005];

bool cmp(Ball a,Ball b){
	return a.x<b.x;
}

int n,x0,pos;
double dp[1005][1005][2],sum[1005];

int main(){
	n=read();x0=read();
	for(int i=1;i<=n;i++)b[i].x=read();
	for(int i=1;i<=n;i++)b[i].y=read();
	for(int i=1;i<=n;i++)b[i].z=read();
	sort(b+1,b+1+n,cmp);
	for(int i=1;i<=n;i++)sum[i]=sum[i-1]+b[i].z;
	for(int i=1;i<=n;i++)
		for(int j=i;j<=n;j++){
			dp[i][j][0]=dp[i][j][1]=-inf;
		}
	for(int i=1;i<=n;i++){
		dp[i][i][0]=dp[i][i][1]=b[i].y-abs(b[i].x-x0)*sum[n];
	}
	for(int l=1;l<n;l++){
		for(int i=1;i<=n-l+1;i++){
			int j=i+l-1;
			if(i-1>=1){
				int w1=b[i].x-b[i-1].x,w2=b[j].x-b[i-1].x;
				dp[i-1][j][0]=max(dp[i-1][j][0],dp[i][j][0]+b[i-1].y-w1*(sum[i-1]+sum[n]-sum[j]));
				dp[i-1][j][0]=max(dp[i-1][j][0],dp[i][j][1]+b[i-1].y-w2*(sum[i-1]+sum[n]-sum[j]));
			}
			if(j+1<=n){
				int w1=b[j+1].x-b[j].x,w2=b[j+1].x-b[i].x;
				dp[i][j+1][1]=max(dp[i][j+1][1],dp[i][j][1]+b[j+1].y-w1*(sum[i-1]+sum[n]-sum[j]));
				dp[i][j+1][1]=max(dp[i][j+1][1],dp[i][j][0]+b[j+1].y-w2*(sum[i-1]+sum[n]-sum[j]));
			}
		}
	}
	printf("%.3lf",max(dp[1][n][0],dp[1][n][1])/1000.0);
	return 0;
}
