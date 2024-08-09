import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

// PUT: Mettre à jour un utilisateur existant
// PUT: Mettre à jour un utilisateur existant
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const updatedUser = await request.json();

    const apiPath = path.join(process.cwd(), 'api.json');
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf8'));

    const userIndex = data.users.findIndex((user: any) => user.id.toString() === id);

    if (userIndex === -1) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Mettre à jour l'utilisateur
    data.users[userIndex] = { 
      ...data.users[userIndex], 
      ...updatedUser,
      trialStartDate: updatedUser.trialStartDate || data.users[userIndex].trialStartDate,
      trialEndDate: updatedUser.trialEndDate || data.users[userIndex].trialEndDate,
      isTrialActive: updatedUser.isTrialActive !== undefined ? updatedUser.isTrialActive : data.users[userIndex].isTrialActive
    };

    // Écrire les modifications dans le fichier
    fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour de l'utilisateur" },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un utilisateur
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const apiPath = path.join(process.cwd(), 'api.json');
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf8'));
    
    const userIndex = data.users.findIndex((user: any) => user.id.toString() === id);
    
    if (userIndex === -1) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }
    
    // Supprimer l'utilisateur
    data.users.splice(userIndex, 1);
    
    // Écrire les modifications dans le fichier
    fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 }
    );
  }
}