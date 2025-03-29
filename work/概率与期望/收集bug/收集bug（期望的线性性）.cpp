#include<iostream>
#include<cstring>
#include<cstdio>
#include<map>
using namespace std;

const int N=1005;
double P[N][N];
int n,s;

double E(int i,int j){
	return 1.0*(n*s)/(n*s-i*j);
}

double ED(int i,int j){
	return E(i,j)*1.0*((n-i)*j)/(n*s-i*j);
}

double ER(int i,int j){
	return E(i,j)*1.0*(i*(s-j))/(n*s-i*j);
}

double ERD(int i,int j){
	return E(i,j)*1.0*((n-i)*(s-j))/(n*s-i*j);
}

int main(){
	scanf("%d%d",&n,&s);
	P[0][0]=1;
	for(int i=0;i<=n;i++){
		for(int j=0;j<=s;j++){
			if(i<n)P[i+1][j]+=P[i][j]*((n-i)*j)/(n*s-i*j);
			if(j<s)P[i][j+1]+=P[i][j]*(i*(s-j))/(n*s-i*j);
			if(i<n&&j<s)P[i+1][j+1]+=P[i][j]*((n-i)*(s-j))/(n*s-i*j);
		}
	}
	
	double ans=0;
	for(int i=0;i<=n;i++){
		for(int j=0;j<=s;j++){
			if(i==n&&j==s)continue;
//			ans+=P[i][j]*ER(i,j);
//			ans+=P[i][j]*ED(i,j);
//			ans+=P[i][j]*ERD(i,j);
//			or
			ans+=P[i][j]*E(i,j);
		}
	}
	printf("%.4f",ans);
	return 0;
}

