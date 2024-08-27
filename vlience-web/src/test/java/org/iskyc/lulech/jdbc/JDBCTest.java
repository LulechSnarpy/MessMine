package org.iskyc.lulech.utils;

import org.sqlite.SQLiteConnection;
import org.sqlite.SQLiteJDBCLoader;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class JDBCTest {
	public static Connection conn;
	public static Statement stmt;
	private static String connectUrl = "jdbc:sqlite:test.db";
	public static void main(String[] args) {
		getStatement(connectUrl);
	}
	
	public static Statement getStatement(String connectUrl) {
		try {
			Class.forName("org.sqlite.JDBC");
			conn = DriverManager.getConnection(connectUrl);
			stmt = conn.createStatement();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		return stmt;
	}

	public static void close(){
		if(null != stmt){
			try {
				stmt.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if(null != conn){
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
}
