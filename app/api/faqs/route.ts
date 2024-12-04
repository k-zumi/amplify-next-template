import { NextResponse } from "next/server";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export async function GET() {
  try {
    const { data } = await client.models.FAQ.list();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GETリクエスト中にエラーが発生しました:", error);
    return NextResponse.json(
      { message: "データの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { question, answer } = await request.json();
    await client.models.FAQ.create({ question, answer });
    return NextResponse.json({ message: "FAQが正常に作成されました" });
  } catch (error) {
    console.error("POSTリクエスト中にエラーが発生しました:", error);
    return NextResponse.json(
      { message: "FAQの作成に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, question, answer } = await request.json();
    if (!id) {
      return NextResponse.json(
        { message: "IDが存在しません" },
        { status: 400 }
      );
    }

    // IDがデータベース上に存在するか確認
    const existingFAQ = await client.models.FAQ.get({ id });
    if (existingFAQ.data === null) {
      return NextResponse.json(
        { message: "指定されたIDのFAQは存在しません" },
        { status: 404 }
      );
    }

    await client.models.FAQ.update({ id, question, answer });
    return NextResponse.json({
      message: "FAQが正常に更新されました",
    });
  } catch (error) {
    console.error("PUTリクエスト中にエラーが発生しました:", error);
    return NextResponse.json(
      { message: "FAQの更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { message: "IDが存在しません" },
        { status: 400 }
      );
    }

    // IDがデータベース上に存在するか確認
    const existingFAQ = await client.models.FAQ.get({ id });
    if (existingFAQ.data === null) {
      return NextResponse.json(
        { message: "指定されたIDのFAQは存在しません" },
        { status: 404 }
      );
    }

    await client.models.FAQ.delete({ id });
    return NextResponse.json({
      message: "FAQが正常に削除されました",
    });
  } catch (error) {
    console.error("DELETEリクエスト中にエラーが発生しました:", error);
    return NextResponse.json(
      { message: "FAQの削除に失敗しました" },
      { status: 500 }
    );
  }
}
