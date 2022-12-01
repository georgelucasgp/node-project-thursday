import { IUpdateVehicleModelRequestDTO } from '@modules/vehicleModel/dtos/IUpdateVehicleModelRequestDTO';
import { VehicleModel } from '@modules/vehicleModel/entities/VehicleModel';
import { IVehicleModelsRepository } from '@modules/vehicleModel/repositories/IVehicleModelsRepository';
import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
class UpdateVehicleModelUseCase {
  constructor(
    @inject('PrismaVehicleModelsRepository')
    private vehicleModelsRepository: IVehicleModelsRepository,
  ) {}

  async execute(data: IUpdateVehicleModelRequestDTO) {
    const vehicleModelAlreadyExists = await this.vehicleModelsRepository.findById(data.id);

    if (!vehicleModelAlreadyExists) {
      throw new AppError('Vehicle does not exist', 400);
    }

    const vehicleModel = VehicleModel.create(data);
    await this.vehicleModelsRepository.update(vehicleModel);
    return vehicleModel;
  }
}

export default UpdateVehicleModelUseCase;