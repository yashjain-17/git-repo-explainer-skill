import sys
from src.analyzer import RepositoryAnalyzer

def main():
    if len(sys.argv) < 2:
        print("Usage: python -m src.formatter <path_to_repo>")
        sys.exit(1)

    repo_path = sys.argv[1]
    print(f"[*] Analyzing repository at: {repo_path}...")
    
    try:
        analyzer = RepositoryAnalyzer()
        report = analyzer.analyze(repo_path)
        print("\n" + "="*40 + "\n REPOSITORY ANALYSIS REPORT\n" + "="*40 + "\n")
        print(report)
    except Exception as e:
        print(f"[!] Error during analysis: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()