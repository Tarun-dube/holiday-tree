import { NextRequest, NextResponse } from "next/server";
import { amadeus } from "@/lib/amadeus";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");

    if (!keyword || keyword.trim().length < 2) {
      return NextResponse.json({
        data: [],
        message: "Keyword must be at least 2 characters long",
      });
    }

    const response = await amadeus.referenceData.locations.get({
      keyword: keyword.trim(),
      subType: "CITY,AIRPORT",
      "page[limit]": 20,
    });

    const locationData = response.data.map((location: any) => ({
      name: `${
        location.name
      }${location.address?.cityName && location.address.cityName !== location.name ? `, ${location.address.cityName}` : ""}`,
      iataCode: location.iataCode,
      city: location.address?.cityName || location.name,
      country: location.address?.countryCode || "",
      type: location.subType,
    }));

    return NextResponse.json({
      data: locationData,
      count: locationData.length,
    });
  } catch (error: any) {
    console.error("Amadeus API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch locations",
        message: error.description || error.message || "Unknown error occurred",
        code: error.code || "UNKNOWN_ERROR",
      },
      { status: error.response?.statusCode || 500 }
    );
  }
}
