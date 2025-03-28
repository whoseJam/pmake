#include <bits/stdc++.h>
using namespace std;
const int N=1010;
double f[N][N];
int n,s;

int main(){
	cin>>n>>s;
	f[n][s]=0;
	for(int i=n;i>=0;i--){
		for(int j=s;j>=0;j--){
			if(i==n&&j==s)continue;
			f[i][j]=(n*s+(n-i)*j*f[i+1][j]+i*(s-j)*f[i][j+1]+
					(n-i)*(s-j)*f[i+1][j+1])/(n*s-i*j);
		}
	}
	printf("%.4lf",f[0][0]);
	return 0;
}
